# 「LibreOJ Round #6」花火 
[LOJ535]

n 个烟火排成一排，从左到右高度分别为 $h_1,h_2,\cdots,h_n$​​，这些高度两两不同。  
每次 Yoko 可以选择两个相邻的烟火交换，这样的交换可以进行任意多次。  
每次 Yoko 还可以选择两个不相邻的烟火交换，但这样的交换至多进行一次。  
你的任务是帮助 Yoko 用最少次数的交换，使这些烟火从左到右的高度递增。

可以知道，第二种操作的操作顺序不影响答案，所以不妨先进行第二种操作，交换两个不相邻的烟火，剩下的问题就是求逆序对的数量了。  
又可以发现，交换的左端一定是前缀最大值，而右端一定是后缀最小值，因为如果不是的话，换成前缀最大值/后缀最小值不会更差。若把每一个烟火看作是$(i,h\_i)$的点，那么要减去的答案实际上就是中间的矩形区域中点的数量乘二。得到前缀最大值和后缀最小值的序列后，可以二分得到每一个点可以被两个序列的哪一部分取到，把第一个序列作为第一维，第二个看作第二唯，转化为一个矩形覆盖问题，询问被覆盖最多的次数，用线段树自底向上维护。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define lowbit(x) ((x)&(-x))
#define lson (now<<1)
#define rson (lson|1)

const int maxN=301000;
const int inf=2147483647;

class Data
{
public:
	int x1,x2,y,opt;
};

class SegmentData
{
public:
	ll lz,mx;
};

int n;
int H[maxN];
int P1[maxN],P2[maxN],H1[maxN],H2[maxN];
int BIT[maxN];
Data D[maxN*2];
SegmentData S[maxN<<2];

void Add(int pos);
int Sum(int pos);
bool cmp(Data A,Data B);
void Modify(int now,int l,int r,int ql,int qr,int opt);

int main()
{
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d",&H[i]);
	ll tot=0;
	for (int i=1;i<=n;i++)
	{
		tot+=Sum(n)-Sum(H[i]);
		Add(H[i]);
	}

	//cout<<tot<<endl;

	int mx=0,mn=inf,cnt1=0,cnt2=0;
	for (int i=1;i<=n;i++) if (H[i]>mx) H1[++cnt1]=mx=H[P1[cnt1]=i];
	for (int i=n;i>=1;i--) if (H[i]<mn) H2[++cnt2]=mn=H[P2[cnt2]=i];
	reverse(&H2[1],&H2[cnt2+1]);reverse(&P2[1],&P2[cnt2+1]);

	//for (int i=1;i<=cnt1;i++) cout<<H1[i]<<" ";cout<<endl;
	//for (int i=1;i<=cnt2;i++) cout<<H2[i]<<" ";cout<<endl;

	int dcnt=0;
	for (int i=1;i<=n;i++)
	{
		int x1=upper_bound(&H1[1],&H1[cnt1+1],H[i])-H1;
		int x2=lower_bound(&P1[1],&P1[cnt1+1],i)-P1-1;
		int y1=upper_bound(&P2[1],&P2[cnt2+1],i)-P2;
		int y2=lower_bound(&H2[1],&H2[cnt2+1],H[i])-H2-1;
		//cout<<"["<<x1<<","<<x2<<"] ["<<y1<<","<<y2<<"]"<<endl;
		if ((x1<=x2)&&(y1<=y2))
		{
			D[++dcnt]=((Data){x1,x2,y1,1});
			D[++dcnt]=((Data){x1,x2,y2+1,-1});
		}
	}

	sort(&D[1],&D[dcnt+1],cmp);
	ll Ans=tot;

	for (int i=1;i<=dcnt;i++)
	{
		Modify(1,1,cnt1,D[i].x1,D[i].x2,D[i].opt);
		if (D[i].y!=D[i+1].y) Ans=min(Ans,tot-S[1].mx*2ll);
	}

	printf("%lld\n",Ans);
	return 0;
}

void Add(int pos){
	while (pos<=n){
		++BIT[pos];pos+=lowbit(pos);
	}
	return;
}

int Sum(int pos){
	int ret=0;
	while (pos){
		ret+=BIT[pos];pos-=lowbit(pos);
	}
	return ret;
}

bool cmp(Data A,Data B){
	return A.y<B.y;
}

void Modify(int now,int l,int r,int ql,int qr,int opt)
{
	if ((l==ql)&&(r==qr)){
		S[now].mx+=opt;S[now].lz+=opt;return;
	}
	int mid=(l+r)>>1;
	if (qr<=mid) Modify(lson,l,mid,ql,qr,opt);
	else if (ql>=mid+1) Modify(rson,mid+1,r,ql,qr,opt);
	else{
		Modify(lson,l,mid,ql,mid,opt);Modify(rson,mid+1,r,mid+1,qr,opt);
	}
	S[now].mx=max(S[lson].mx,S[rson].mx)+S[now].lz;
	return;
}
```