# 上下序列Mausoleum
[51nod1522,CF567F]

现在有1到n的整数，每一种有两个。要求把他们排在一排，排成一个2*n长度的序列，排列的要求是从左到右看，先是不降，然后是不升。  
特别的，也可以只由不降序列，或者不升序列构成。  
例如，下面这些序列都是合法的：  
·        [1,2,2,3,4,4,3,1];  
·        [1,1];  
·        [2,2,1,1];  
·        [1,2,3,3,2,1].  
除了以上的条件以外，还有一些其它的条件，形如"h[xi] signi h[yi]"，这儿h[t]表示第t个位置的数字，signi是下列符号之一：'=' (相等), '<' (小于), '>' (大于), '<=' (小于等于), '>=' (大于等于)。这样的条件有k个。  
请计算一下有多少种序列满足条件。

由题目可以知道，是先上升后下降的序列，那么如果从小往大放数就是从两边往中间放。设 F[i][j] 表示把 [1,i],[j,n+n] 都放完的合法方案数，讨论两个 i 是都放左边、一左一右还是都放右边。这样枚举的好处是同时知道了数的大小关系，可以及时判断。  
需要注意处理上的细节。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define Trans(a,b,c,d) a//cout<<"("<<a<<","<<b<<") -> ("<<c<<","<<d<<")"<<endl

const int maxN=75;
const int maxM=510;
const int inf=2147483647;

class Limit
{
public:
	int opt,v;
};

int n,K;
int edgecnt=0,Head[maxN],Next[maxM];
Limit E[maxM];
ll F[maxN][maxN];

void Add_Edge(int u,int v,int opt);
bool check(int u,int v,int l,int r,int pl,int pr);

int main(){
	mem(Head,-1);
	scanf("%d%d",&n,&K);
	for (int i=1;i<=K;i++){
		int u,v;char s[5];scanf("%d %s %d",&u,s,&v);
		if (u==v){
			if ( ((s[0]=='<')||(s[0]=='>')) && (s[1]!='=')){
				printf("0\n");return 0;
			}
			continue;
		}
		if (s[0]=='=') Add_Edge(u,v,1),Add_Edge(v,u,1);
		if (s[0]=='<'){
			if (s[1]=='=') Add_Edge(u,v,4),Add_Edge(v,u,5);
			else Add_Edge(u,v,2),Add_Edge(v,u,3);
		}
		if (s[0]=='>'){
			if (s[1]=='=') Add_Edge(u,v,5),Add_Edge(v,u,4);
			else Add_Edge(u,v,3),Add_Edge(v,u,2);
		}
	}
	mem(F,0);F[0][n+n+1]=1;
	for (int i=1;i<=n;i++)
		for (int l=0;l<=i*2;l++){
			int r=n+n-(i*2-l)+1;
			if (check(l,r,l,r,l-1,r+1)) F[l][r]+=F[l-1][r+1],Trans(l-1,r+1,l,r);
			if (l==r-1) continue;
			if (check(l-1,l,l,r,l-2,r)) F[l][r]+=F[l-2][r],Trans(l-2,r,l,r);
			if (check(r,r+1,l,r,l,r+2)) F[l][r]+=F[l][r+2],Trans(l,r+2,l,r);
		}

	ll Ans=0;
	for (int i=0;i<=n+n;i++) Ans+=F[i][i+1];
	printf("%lld\n",Ans);return 0;
}

void Add_Edge(int u,int v,int opt){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;E[edgecnt]=((Limit){opt,v});
	return;
}

bool check(int u,int v,int l,int r,int pl,int pr){
	if ((u>=v)||(u<=0)||(v>=n+n+1)) return 0;
	if ((l>r)||(pl>pr)||(pl<0)||(pr>n+n+1)) return 0;
	for (int i=Head[u];i!=-1;i=Next[i])
		if ((E[i].opt==1)&&(E[i].v!=v)) return 0;
		else if ((E[i].opt==2)&&((E[i].v<=l)||(E[i].v>=r))) return 0;
		else if ((E[i].opt==3)&&(E[i].v<pr)&&(E[i].v>pl)) return 0;
		else if ((E[i].opt==4)&&((E[i].v<=pl)||(E[i].v>=pr))) return 0;
		else if ((E[i].opt==5)&&(E[i].v<r)&&(E[i].v>l)) return 0;
	for (int i=Head[v];i!=-1;i=Next[i])
		if ((E[i].opt==1)&&(E[i].v!=u)) return 0;
		else if ((E[i].opt==2)&&((E[i].v<=l)||(E[i].v>=r))) return 0;
		else if ((E[i].opt==3)&&(E[i].v<pr)&&(E[i].v>pl)) return 0;
		else if ((E[i].opt==4)&&((E[i].v<=pl)||(E[i].v>=pr))) return 0;
		else if ((E[i].opt==5)&&(E[i].v<r)&&(E[i].v>l)) return 0;
	return 1;
}
```