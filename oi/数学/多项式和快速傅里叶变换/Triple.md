# Triple
[BZOJ3771]

我们讲一个悲伤的故事。  
从前有一个贫穷的樵夫在河边砍柴。  
这时候河里出现了一个水神，夺过了他的斧头，说：  
“这把斧头，是不是你的？”  
樵夫一看：“是啊是啊！”  
水神把斧头扔在一边，又拿起一个东西问：  
“这把斧头，是不是你的？”  
樵夫看不清楚，但又怕真的是自己的斧头，只好又答：“是啊是啊！”  
水神又把手上的东西扔在一边，拿起第三个东西问：  
“这把斧头，是不是你的？”  
樵夫还是看不清楚，但是他觉得再这样下去他就没法砍柴了。  
于是他又一次答：“是啊是啊！真的是！”  
水神看着他，哈哈大笑道：  
“你看看你现在的样子，真是丑陋！”  
之后就消失了。  
樵夫觉得很坑爹，他今天不仅没有砍到柴，还丢了一把斧头给那个水神。  
于是他准备回家换一把斧头。  
回家之后他才发现真正坑爹的事情才刚开始。  
水神拿着的的确是他的斧头。  
但是不一定是他拿出去的那把，还有可能是水神不知道怎么偷偷从他家里拿走的。  
换句话说，水神可能拿走了他的一把，两把或者三把斧头。  
樵夫觉得今天真是倒霉透了，但不管怎么样日子还得过。  
他想统计他的损失。  
樵夫的每一把斧头都有一个价值，不同斧头的价值不同。总损失就是丢掉的斧头价值和。  
他想对于每个可能的总损失，计算有几种可能的方案。  
注意：如果水神拿走了两把斧头a和b，(a,b)和(b,a)视为一种方案。拿走三把斧头时，(a,b,c),(b,c,a),(c,a,b),(c,b,a),(b,a,c),(a,c,b)视为一种方案。  

分别求一把斧子，两把斧子和三把斧子的方案。一把的直接累加，两把的把两个卷积一下，然后去掉$(a,a)$这种形式的，再除以$2$因为$(a,b),(b,a)$算一种方案。三把的先算三次卷积，然后减去$(a,a,b)$这样的，这个可以用两个卷积起来得到，再去重。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<cmath>
using namespace std;

#define ll long long
#define ld long double
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=40010*4;
const ld Pi=acos(-1);
const int inf=2147483647;

class Complex
{
public:
	ld x,y;
	Complex(){}
	Complex(ld a,ld b){
		x=a;y=b;return;
	}
};

int n;
int Val[maxN],Rader[maxN];
ll Ans[maxN],Cnt[maxN];
Complex Wn[maxN],A[maxN],B1[maxN],B2[maxN],B3[maxN];

Complex operator + (Complex A,Complex B);
Complex operator - (Complex A,Complex B);
Complex operator * (Complex A,Complex B);
void FFT(Complex *P,int N,int opt);

int main()
{
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d",&Val[i]),Ans[Val[i]]++,Cnt[Val[i]]++;
	sort(&Val[1],&Val[n+1]);

	//两组合
	for (int i=1;i<=Val[n];i++) A[i]=Complex(Cnt[i],0);
	int N=1,L=0;
	for (N=1;N<=Val[n]+Val[n];N<<=1) L++;
	for (int i=0;i<N;i++) Rader[i]=(Rader[i>>1]>>1)|((i&1)<<(L-1));
	for (int i=0;i<N;i++) Wn[i]=Complex(cos(2*Pi*i/N),sin(2*Pi*i/N));
	FFT(A,N,1);
	for (int i=0;i<N;i++) A[i]=A[i]*A[i];
	FFT(A,N,-1);
	for (int i=1;i<=n;i++) A[Val[i]+Val[i]].x-=1.0;
	for (int i=1;i<=Val[n]+Val[n];i++) A[i].x/=2;
	//cout<<"2:"<<endl;for (int i=0;i<N;i++) cout<<A[i].x<<" ";cout<<endl;
	for (int i=0;i<N;i++) Ans[i]=Ans[i]+(ll)A[i].x;

	//三组合
	for (int i=1;i<=n;i++) B1[Val[i]].x+=1.0,B2[Val[i]+Val[i]].x+=1.0;
	L=0;
	for (N=1;N<=Val[n]+Val[n]+Val[n];N<<=1) L++;
	for (int i=0;i<N;i++) Rader[i]=(Rader[i>>1]>>1)|((i&1)<<(L-1));
	for (int i=0;i<N;i++) Wn[i]=Complex(cos(2*Pi*i/N),sin(2*Pi*i/N));
	FFT(B1,N,1);FFT(B2,N,1);
	for (int i=0;i<N;i++) B2[i]=B2[i]*B1[i];
	for (int i=0;i<N;i++) B1[i]=B1[i]*B1[i]*B1[i];
	FFT(B1,N,-1);FFT(B2,N,-1);
	//cout<<"After FFT:[B2]"<<endl;for (int i=0;i<N;i++) cout<<B2[i].x<<" ";cout<<endl;
	for (int i=1;i<=n;i++) B2[Val[i]+Val[i]+Val[i]].x-=1.0;
	//cout<<"After FFT:[B1]"<<endl;for (int i=0;i<N;i++) cout<<B1[i].x<<" ";cout<<endl;
	for (int i=1;i<=n;i++) B1[Val[i]+Val[i]+Val[i]].x-=1.0;
	//cout<<"After -Val[i]*3:[B1]"<<endl;for (int i=0;i<N;i++) cout<<B1[i].x<<" ";cout<<endl;
	for (int i=0;i<N;i++) B1[i].x-=B2[i].x*3.0;
	//cout<<"After -B2*3.0:[B1]"<<endl;for (int i=0;i<N;i++) cout<<B1[i].x<<" ";cout<<endl;
	for (int i=0;i<N;i++) B1[i].x/=6;
	//cout<<"After /6:[B1]"<<endl;for (int i=0;i<N;i++) cout<<B1[i].x<<" ";cout<<endl;
	for (int i=0;i<N;i++) Ans[i]=Ans[i]+(ll)B1[i].x;

	for (int i=0;i<N;i++) if (Ans[i]!=0) printf("%d %lld\n",i,Ans[i]);
	return 0;
}

Complex operator + (Complex A,Complex B){
	return Complex(A.x+B.x,A.y+B.y);
}

Complex operator - (Complex A,Complex B){
	return Complex(A.x-B.x,A.y-B.y);
}

Complex operator * (Complex A,Complex B){
	return Complex(A.x*B.x-A.y*B.y,A.x*B.y+A.y*B.x);
}

void FFT(Complex *P,int N,int opt)
{
	for (int i=0;i<N;i++) if (i<Rader[i]) swap(P[i],P[Rader[i]]);
	for (int i=1;i<N;i<<=1)
		for (int j=0;j<N;j=j+(i<<1))
			for (int k=0;k<i;k++)
			{
				Complex X=P[j+k],Y=P[j+k+i]*Complex(Wn[N/(i<<1)*k].x,Wn[N/(i<<1)*k].y*opt);
				P[j+k]=X+Y;P[j+k+i]=X-Y;
			}
	if (opt==-1) for (int i=0;i<N;i++) P[i].x=(ll)(P[i].x/N+0.5);
	return;
}
```