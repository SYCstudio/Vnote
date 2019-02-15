# Gosha is hunting
[CF739E]

Gosha is hunting. His goal is to catch as many Pokemons as possible. Gosha has a Poke Balls and b Ultra Balls. There are n Pokemons. They are numbered 1 through n. Gosha knows that if he throws a Poke Ball at the i-th Pokemon he catches it with probability pi. If he throws an Ultra Ball at the i-th Pokemon he catches it with probability ui. He can throw at most one Ball of each type at any Pokemon.  
The hunting proceeds as follows: at first, Gosha chooses no more than a Pokemons at which he will throw Poke Balls and no more than b Pokemons at which he will throw Ultra Balls. After that, he throws the chosen Balls at the chosen Pokemons. If he throws both Ultra Ball and Poke Ball at some Pokemon, he is caught if and only if he is caught by any of these Balls. The outcome of a throw doesn't depend on the other throws.  
Gosha would like to know what is the expected number of the Pokemons he catches if he acts in an optimal way. In other words, he would like to know the maximum possible expected number of Pokemons can catch.

你要抓神奇宝贝！现在一共有 $N$ 只神奇宝贝。你有 $a$ 个『宝贝球』和 $b$ 个『超级球』。『宝贝球』抓到第 $i$ 只神奇宝贝的概率是 $p_i$ ，『超级球』抓到的概率则是 $u_i$ 。不能往同一只神奇宝贝上使用超过一个同种的『球』，但是可以往同一只上既使用『宝贝球』又使用『超级球』（都抓到算一个）。请合理分配每个球抓谁，使得你抓到神奇宝贝的总个数期望最大，并输出这个值。

朴素的想法是设 $F[i][j][k]$ 表示前 $i$ 个，用了两种球分别为 $j,k$ 个的最大期望。带权二分第三维，每选择一个第二种球就要付出额外的代价，那么这个代价越大，第二种球选择的就越少，否则越多。这样就变成两维的了。当然也可以把两维都二分。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define ld double
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=2010;
const ld eps=1e-11;
const int inf=2147483647;

class Data
{
public:
	ld key;int cnt;
};

int n,A,B;
ld P1[maxN],P2[maxN];
Data Ans,F[maxN][maxN];

void Calc(ld ex);
void Update(Data &A,Data B);
bool operator < (Data A,Data B);
Data operator + (Data A,Data B);

int main(){
	scanf("%d%d%d",&n,&A,&B);
	for (int i=1;i<=n;i++) scanf("%lf",&P1[i]);
	for (int i=1;i<=n;i++) scanf("%lf",&P2[i]);

	ld L=-1,R=1,pos=1;
	do{
		ld mid=(L+R)/2.0;
		Calc(mid);
		if (Ans.cnt>=B) pos=mid,L=mid+eps;
		else R=mid-eps;
	}
	while (L+eps<=R);

	Calc(pos);
	printf("%.8lf\n",Ans.key+B*pos);
	return 0;
}

void Calc(ld ex){
	F[0][0]=Ans=((Data){0,0});
	for (int i=1;i<=n;i++)
		for (int j=0;j<=A;j++){
			F[i][j]=F[i-1][j];
			if (j!=0){
				Update(F[i][j],F[i-1][j-1]+((Data){P1[i],0}));
				Update(F[i][j],F[i-1][j-1]+((Data){1.0-(1.0-P1[i])*(1.0-P2[i])-ex,1}));
			}
			Update(F[i][j],F[i-1][j]+((Data){P2[i]-ex,1}));

			Update(Ans,F[i][j]);
		}
	return;
}

void Update(Data &A,Data B){
	if (A<B) A=B;return;
}

bool operator < (Data A,Data B){
	if (A.key!=B.key) return A.key<B.key;
	return A.cnt<B.cnt;
}

Data operator + (Data A,Data B){
	return ((Data){A.key+B.key,A.cnt+B.cnt});
}
```